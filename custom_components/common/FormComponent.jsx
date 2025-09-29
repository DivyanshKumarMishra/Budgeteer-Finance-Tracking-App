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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns/format';

function FormComponent({
  defaultValues = {},
  inputFields = [],
  validationSchema,
  loading = false,
  data = null,
  toastSuccessMsg = '',
  toastErrorMsg = '',
  submitBtnText = 'Submit',
  error = null,
  handleDrawer = () => {},
  onSubmit = () => {},
  useDrawerClose = false,
  className = '',
  loadingVerb = '',
}) {
  // console.log(defaultValues);

  const router = useRouter();

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
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (error) {
      toast.error(toastErrorMsg);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      toast.success(toastSuccessMsg);
      reset();
      useDrawerClose
        ? handleDrawer(false)
        : router.replace(`/account/${data?.accountId}`);
    }
  }, [loading]);

  function handleError(errors) {
    // console.log(getValues());
    // console.log(errors);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, handleError)}
      className={`h-full overflow-auto ${className}`}
    >
      {renderInputFields(
        inputFields,
        errors,
        register,
        setValue,
        reset,
        watch,
        getValues,
        loading
      )}
      <div className="flex gap-4 my-5 justify-center">
        {useDrawerClose ? (
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
        ) : (
          <Button
            type="button"
            variant="outline"
            className="hover:bg-red-500 hover:text-white hover:border-none flex-1"
            disabled={loading}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="bg-accent hover:bg-primary flex-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingVerb}...
            </>
          ) : (
            `${submitBtnText}`
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
  watch = () => {},
  getValues = () => {},
  loading = false
) => {
  if (inputFields.length === 0) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {inputFields.map((input) => {
        const { field, type, label, options, placeholder, ...restProps } =
          input;

        // ✅ Text and Number inputs
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
                step={input.step}
                disabled={loading}
              />
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          );
        }

        // ✅ Textarea input
        if (type === 'textarea') {
          return (
            <div
              key={field}
              // className="md:col-span-2" // full row in grid
            >
              <label
                htmlFor={field}
                className="block text-sm font-medium text-foreground mb-1 text-left pl-2"
              >
                {label}
              </label>
              <textarea
                id={field}
                {...register(field)}
                placeholder={placeholder}
                rows={4}
                disabled={loading}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          );
        }

        // ✅ Date picker input
        if (type === 'date') {
          const date = watch(field);
          return (
            <div className="space-y-2" key={field}>
              <label className="text-sm font-medium">{label}</label>
              <Popover>
                <PopoverTrigger asChild className="hover:bg-background">
                  <Button
                    variant="outline"
                    disabled={loading}
                    className={`w-full pl-3 text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                  >
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue('date', date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors[field] && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors[field].message}
                </p>
              )}
            </div>
          );
        }

        // ✅ Select input
        if (type === 'select') {
          const selectedValue = watch(field);
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
                value={selectedValue || ''}
                disabled={loading}
              >
                <SelectTrigger
                  id={field}
                  className={`w-full ${selectedValue?.startsWith('none') ? 'text-gray-400' : ''}`}
                >
                  <SelectValue placeholder={placeholder || 'Select option'} />
                </SelectTrigger>
                <SelectContent>
                  {/* Add an empty option */}
                  <SelectItem key="none" value="none">
                    {placeholder || 'Select option'}
                  </SelectItem>

                  {options?.length > 0 &&
                    options.map((option) => {
                      const optionKey =
                        typeof option === 'string' ? option : option.key;
                      const optionValue =
                        typeof option === 'string' ? option : option.value;

                      return (
                        <SelectItem key={optionKey} value={optionValue}>
                          {optionKey}
                        </SelectItem>
                      );
                    })}
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

        // ✅ Switch input
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
                  disabled={loading}
                />
              </div>
              {restProps.subtext && (
                <p className="text-xs md:text-sm text-left ml-2 text-muted-foreground">
                  {restProps.subtext}
                </p>
              )}
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
