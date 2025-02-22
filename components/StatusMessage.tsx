import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const StatusMessage = ({ type, title, message }: {type: string, title: string, message: string}) => (
    <div className={cn(
      "fixed bottom-4 right-4 max-w-md bg-card p-4 rounded-lg shadow-lg border transition-all",
      type === 'success' ? 'border-green-500' : 'border-red-500'
    )}>
      <div className="flex gap-3">
        {type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
  
  export default StatusMessage;