import { Switch } from "./ui/switch";

// interface ControlToggleProps {
//   checked: boolean;
//   onCheckedChange: (checked: boolean) => void;
// }

const ControlToggle = ({ checked, onCheckedChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm">{checked ? "On" : "Off"}</span>
    </div>
  );
};

export default ControlToggle;
