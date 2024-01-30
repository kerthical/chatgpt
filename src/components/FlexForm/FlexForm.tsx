import type { Modify } from '@/types/modify';
import type { FlexProps } from '@mantine/core';
import type { ComponentPropsWithoutRef, FormEventHandler } from 'react';

import { Flex } from '@mantine/core';
import { forwardRef } from 'react';

interface FlexFormProps
  extends Modify<
      FlexProps,
      {
        onSubmit: FormEventHandler<HTMLFormElement>;
      }
    >,
    Omit<ComponentPropsWithoutRef<'form'>, keyof FlexProps> {}

/**
 * Wrapper for @mantine/core Flex component for forms.
 */
export const FlexForm = forwardRef<HTMLFormElement, FlexFormProps>(({ children, onSubmit, ...props }, ref) => (
  <Flex component="form" onSubmit={onSubmit as unknown as FormEventHandler<HTMLDivElement>} ref={ref} {...props}>
    {children}
  </Flex>
));

FlexForm.displayName = '@mantine/core/FlexForm';
