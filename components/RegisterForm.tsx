import { useState } from 'react';
import Form from 'next/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  const RequiredIndicator = () => (
    <span className="text-red-500 ml-1" title="Required field">*</span>
  );

  return (
    <Form
      action={action}
 
      className="w-full max-w-md mx-auto space-y-6 p-4 sm:p-6 md:p-8 flex flex-col gap-4  sm:px-16"
    >
      {/* Full Name Field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="name"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Full Name<RequiredIndicator />
        </Label>
        <Input
          id="name"
          name="name"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          required
          autoFocus
        />
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email Address<RequiredIndicator />
        </Label>
        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password<RequiredIndicator />
        </Label>
        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
          minLength={8}
        />
      </div>

      {/* Passcode Field */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="passcode"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          4-Digit Passcode<RequiredIndicator />
        </Label>
        <Input
          id="passcode"
          name="passcode"
          className={cn(
            "bg-muted text-md md:text-sm tracking-widest text-center",
            "font-mono text-lg"
          )}
          type="text"
          pattern="\d{4}"
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          required
          onInput={(e) => {
            const input = e.currentTarget;
            input.value = input.value.replace(/\D/g, '').slice(0, 4);
          }}
        />
      </div>

      {/* Profile Image Upload Section */}
      <div className="space-y-4">
        <Label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Profile Image
        </Label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <img
              src={profileImage || '/images/default-profile.png'}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="avatar-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="avatar-upload"
              className={cn(
                "flex justify-center sm:justify-start cursor-pointer items-center gap-2",
                "rounded-md border px-4 py-2 hover:bg-accent transition-colors",
                "text-sm font-medium",
                isLoading && "cursor-not-allowed opacity-50"
              )}
            >
              <Upload className="size-4" />
              {profileImage ? 'Change Image' : 'Upload Image'}
            </label>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Optional. Default avatar will be used if none provided.
            </p>
          </div>
        </div>
      </div>

  
        {children}
     
    </Form>
  );
}