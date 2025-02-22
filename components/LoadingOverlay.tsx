import { Loader2 } from "lucide-react";

const LoadingOverlay = ({ message }: {message: string}) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-white">Creating Your Avatar</h3>
          <p className="text-gray-300 text-base">{message}</p>
        </div>
      </div>
    </div>
  );

  export default LoadingOverlay;