import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

/**
 * Compatibility layer between hook form and material form components.
 */
export function materialRegister<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  register: UseFormRegister<TFieldValues>,
  name: TFieldName,
  options?: RegisterOptions<TFieldValues, TFieldName>
) {
  const { ref, ...rest } = register(name, options);
  return { inputRef: ref, ...rest };
}
