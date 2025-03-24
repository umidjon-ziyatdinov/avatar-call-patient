  // QuickActions.tsx
  import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
  
  interface QuickActionsProps {
    onEditPatient: () => void;
    onOpenCallDialog: () => void;
    patientName?: string;
  }
  
  const QuickActions = ({ onEditPatient,onOpenCallDialog, patientName }: QuickActionsProps) => (
    <div className="grid grid-cols-2 gap-3">
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={onEditPatient}>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
          <Users className="size-5 text-primary" />
          <p className="text-sm font-medium">Manage {patientName}&apos;s Detail</p>
        </CardContent>
      </Card>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={onOpenCallDialog}>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
          <Clock className="size-5 text-primary" />
          <p className="text-sm font-medium">Call Logs</p>
        </CardContent>
      </Card>
    </div>
  );


  export default QuickActions;