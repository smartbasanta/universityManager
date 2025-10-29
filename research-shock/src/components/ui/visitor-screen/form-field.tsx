import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  value: string;
  className?: string;
}

export const FormField = ({ label, value, className }: FormFieldProps) => {
  return (
    <div className={cn('flex justify-between items-center py-2', className)}>
      <p className="text-[#111518] text-base font-medium">{label}</p>
      <p className="text-[#111518] text-base font-normal">{value}</p>
    </div>
  );
};
