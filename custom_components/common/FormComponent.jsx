'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function FormComponent({
  defaultValues = {},
  inputFields = [],
  validationSchema,
  loading = false,
  data = null,
  toastMsg = '',
  error,
  handleDrawer = () => {},
  onSubmit = () => {},
}) {
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to create account');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      toast.success(toastMsg);
      setTimeout(() => {
        handleDrawer(false);
      }, 2000);
    }
  }, [data, loading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full overflow-auto px-2 md:px-4"
    >
      {renderInputFields(inputFields, errors, register, setValue, reset, watch)}
      <div className="flex gap-4 my-5 justify-center">
        <DrawerClose asChild>
          <Button
            type="button"
            variant="outline"
            className="hover:bg-red-500 hover:text-white hover:border-none flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        </DrawerClose>
        <Button type="submit" className="bg-accent hover:bg-primary flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </form>
  );
}

const renderInputFields = (
  inputFields = [],
  errors = {},
  register = () => {},
  setValue = () => {},
  reset = () => {},
  watch = () => {}
) => {
  if (inputFields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inputFields.map((input) => {
        const { field, type, label, options, placeholder } = input;

        if (type === 'text' || type === 'number') {
          return (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-foreground mb-1 text-left pl-2"
              >
                {label}
              </label>
              <Input
                id={field}
                {...register(field)}
                type={type}
                placeholder={placeholder}
                className=""
                step={input.step}
              />
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          );
        }

        if (type === 'select') {
          return (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-foreground mb-1 text-left pl-2"
              >
                {label}
              </label>
              <Select
                onValueChange={(value) => setValue(field, value)}
                defaultValue={watch(field)}
              >
                <SelectTrigger id={field} className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {options?.length > 0 &&
                    options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          );
        }

        if (type === 'switch') {
          return (
            <div key={field}>
              <div className="flex gap-4 md:mt-3">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-foreground mb-1 text-left pl-2"
                >
                  {label}
                </label>
                <Switch
                  id={field}
                  onCheckedChange={(value) => setValue(field, value)}
                  defaultValue={watch(field)}
                />
              </div>
              <p className="text-xs md:text-sm text-left ml-2 text-muted-foreground">
                Thiis will be default account for all transactions.
              </p>
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default FormComponent;
