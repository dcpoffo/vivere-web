import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Option = {
    value: string;
    label: string;
};

interface CustomSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
}

export function SelectPadrao({ label, value, onChange, options, placeholder = "Selecione" }: CustomSelectProps) {
    return (
        <FormItem>
            <FormLabel className="col-span-1 font-semibold">{label}</FormLabel>
            <FormControl>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full border p-2 bg-white text-black">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
