import { useState, useEffect } from "react";
import { X, Upload, Laptop, DollarSign, User, Phone, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(3, "Model must be at least 3 characters"),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor'], {
    message: "Please select a condition",
  }),
  price: z.coerce.number().min(1, "Price must be greater than $0"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Enter a valid 10-15 digit phone number"),
  images: z
    .any()
    .refine((files) => files && files.length > 0, "At least one image is required.")
    .refine((files) => files && files.length <= 5, "You can only upload up to 5 images.")
    .refine(
      (files) => !files || Array.from(files as FileList).every((file) => file.size <= MAX_FILE_SIZE),
      "Each image must be less than 5MB."
    )
    .refine(
      (files) => !files || Array.from(files as FileList).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type FormValues = z.infer<typeof formSchema>;
type FormInput = z.input<typeof formSchema>;

export function ListLaptopModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
      price: undefined,
      name: "",
      phone: ""
    }
  });

  const conditionValue = watch("condition");
  const watchImages = watch("images");

  useEffect(() => {
    // Clean up previous URLs to avoid memory leaks
    imagePreviews.forEach(url => URL.revokeObjectURL(url));

    if (watchImages && watchImages.length > 0 && !errors.images) {
      const filesArray = Array.from(watchImages as FileList);
      const previews = filesArray.slice(0, 5).map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [watchImages, errors.images]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    onClose();
  };

  const removeImage = (indexToRemove: number) => {
    if (!watchImages) return;
    const dt = new DataTransfer();
    const filesArray = Array.from(watchImages as FileList);
    filesArray.forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });
    setValue("images", dt.files, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Data Submitted:", data);
    alert("Laptop listed successfully!");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] sm:max-h-full">

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-gray-800 bg-gray-900/95 z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-white">List Your Laptop</h2>
            <p className="text-sm text-gray-400 mt-1">Get an instant estimate for your used device.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 pb-4 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Brand</label>
              <div className="relative">
                <Laptop className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <select
                  {...register("brand")}
                  className={`w-full bg-gray-800 border ${errors.brand ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none`}
                >
                  <option value="">Select Brand</option>
                  <option value="apple">Apple</option>
                  <option value="dell">Dell</option>
                  <option value="hp">HP</option>
                  <option value="lenovo">Lenovo</option>
                  <option value="asus">Asus</option>
                  <option value="acer">Acer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.brand && <p className="text-xs text-red-400">{errors.brand.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Model / Specs</label>
              <input
                {...register("model")}
                type="text"
                placeholder="e.g. MacBook Pro M1 16GB"
                className={`w-full bg-gray-800 border ${errors.model ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
              />
              {errors.model && <p className="text-xs text-red-400">{errors.model.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {['Excellent', 'Good', 'Fair', 'Poor'].map((condition) => (
                <label key={condition} className="cursor-pointer">
                  <input
                    type="radio"
                    value={condition}
                    {...register("condition")}
                    className="peer sr-only"
                  />
                  <div className={`text-center py-2 bg-gray-800 border rounded-lg text-sm transition-colors ${conditionValue === condition ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                    {condition}
                  </div>
                </label>
              ))}
            </div>
            {errors.condition && <p className="text-xs text-red-400">{errors.condition.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Expected Price ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                {...register("price")}
                type="number"
                placeholder="500"
                className={`w-full bg-gray-800 border ${errors.price ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
              />
            </div>
            {errors.price && <p className="text-xs text-red-400">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
              Upload Images (Max 5MB)
              <span className="text-xs text-gray-500">Up to 5 images</span>
            </label>
            
            {imagePreviews.length === 0 ? (
              <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${errors.images ? 'border-red-500 bg-red-500/5' : 'border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none text-center px-4">
                  <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400"><span className="font-semibold text-purple-400">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP</p>
                </div>
                <input 
                  {...register("images")}
                  type="file" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 group">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 p-1.5 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-500 bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <ImagePlus className="w-6 h-6 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-400">Add More</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/jpeg, image/png, image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                           const dt = new DataTransfer();
                           const existingFiles = watchImages ? Array.from(watchImages as FileList) : [];
                           existingFiles.forEach(f => dt.items.add(f));
                           Array.from(e.target.files).forEach(f => dt.items.add(f));
                           setValue("images", dt.files, { shouldValidate: true });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {errors.images && <p className="text-xs text-red-400">{errors.images.message as string}</p>}
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium text-gray-300 mb-3">Contact Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your Name"
                    className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Phone Number"
                    className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-800 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 rounded-lg transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? "Validating & Submitting..." : (
                <>
                  <Upload size={16} />
                  Submit Listing
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
