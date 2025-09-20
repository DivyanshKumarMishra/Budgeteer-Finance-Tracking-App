'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useState } from 'react';
import FormComponent from './FormComponent';
import { validationSchemas } from '@/schemas/validation';
import { defaultValues, input_fields } from '@/schemas/input_fields';
import useFetch from '@/hooks/UseFetch';
import { createAccount } from '@/actions/dashboard';

const RenderForm = ({ formType, handleDrawer }) => {
  const {
    data: newAccount,
    loading: createAccountLoading,
    error: createAccountError,
    fn: createAccountFn,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  return (
    <FormComponent
      validationSchema={validationSchemas[formType]}
      defaultValues={defaultValues[formType]}
      inputFields={input_fields[formType]}
      onSubmit={onSubmit}
      loading={createAccountLoading}
      data={newAccount}
      toastMsg="Account created successfully"
      handleDrawer={handleDrawer}
      error={createAccountError}
    />
  );
};

function EntityCreationDrawer({
  trigger,
  children,
  title,
  description,
  useForm = false,
  formType = '',
}) {
  const [open, setOpen] = useState(false);
  // const [accountsLoading, setAccountsLoading] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        aria-describedby={description ? 'drawer-description' : undefined}
      >
        <DrawerHeader>
          <DrawerTitle className="text-primary text-2xl font-semibold">
            {title}
          </DrawerTitle>
          {description && (
            <DrawerDescription id="drawer-description">
              {description}
            </DrawerDescription>
          )}
          <div className="max-h-[50vh] overflow-auto px-2 md:px-4 mt-5">
            {useForm ? (
              <RenderForm formType={formType} handleDrawer={setOpen} />
            ) : (
              children
            )}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default EntityCreationDrawer;
