import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProvinceSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export const ProvinceSelect = ({
  value,
  onChange,
  error,
  required = true,
}: ProvinceSelectProps) => {
  const isMobile = useIsMobile();
  const labelSize = isMobile ? "text-sm" : "text-base";

  return (
    <div className="space-y-2">
      <Label className={`${labelSize} font-medium`}>
        Province {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select province" />
        </SelectTrigger>
        <SelectContent>
          {PROVINCES.map((province) => (
            <SelectItem key={province} value={province}>
              {province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
