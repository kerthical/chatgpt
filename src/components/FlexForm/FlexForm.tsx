import { Modify } from '@/types/modify';
import { Flex, FlexProps } from '@mantine/core';
import { ComponentPropsWithoutRef, FormEventHandler, forwardRef } from 'react';

interface FlexFormProps
  extends Modify<
      FlexProps,
      {
        onSubmit: FormEventHandler<HTMLFormElement>;
      }
    >,
    Omit<ComponentPropsWithoutRef<'form'>, keyof FlexProps> {}

export const FlexForm = forwardRef<HTMLFormElement, FlexFormProps>(({ children, onSubmit, ...props }, ref) => (
  <Flex component="form" onSubmit={onSubmit as unknown as FormEventHandler<HTMLDivElement>} ref={ref} {...props}>
    {children}
  </Flex>
));

FlexForm.displayName = '@mantine/core/FlexForm';
