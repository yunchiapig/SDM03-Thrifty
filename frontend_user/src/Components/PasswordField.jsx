import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react'
import { forwardRef, useRef } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

export const PasswordField = forwardRef(({value, onChange}, ref) => {
  const { isOpen, onToggle } = useDisclosure()
  const { t, i18n } = useTranslation()
  const inputRef = useRef(null)
  const mergeRef = useMergeRefs(inputRef, ref)
  const onClickReveal = () => {
    onToggle()
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      })
    }
  }
  return (
    <FormControl>
      <FormLabel htmlFor="password">{t('loginCard.password')}</FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id="password"
          ref={mergeRef}
          name="password"
          type={isOpen ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          required
        />
      </InputGroup>
    </FormControl>
  )
})
PasswordField.displayName = 'PasswordField'
