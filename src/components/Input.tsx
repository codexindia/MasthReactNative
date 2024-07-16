import { TextInput, TextInputProps, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface InputProps extends TextInputProps {
  className?: string
  SvgIcon?: React.FC<SvgProps>
  LeftUI?: React.ReactNode
  RightUI?: React.ReactNode
  error?: boolean
}

export const Input: React.FC<InputProps> = ({ onTextInput, placeholder = 'Sample Placeholder', style, className, LeftUI, RightUI, ...rest }) => {
  const spaceLeft = LeftUI ? 12 : 0
  const spaceRight = RightUI ? 10 : 0
  const error = rest.error
  return (
    <View
      className={`flex flex-shrink flex-row items-center justify-center rounded-2xl ${
        error ? 'border-red-500' : 'border-neutral-300'
      } bg-neutral-100 ${className}`}
      style={[{ borderWidth: 1.5, paddingVertical: 1, paddingLeft: 15, paddingRight: 10 }, style]}
    >
      {LeftUI}
      <TextInput
        placeholder={placeholder}
        className='flex-1 border-none border-transparent outline-none'
        style={{ fontSize: 16, paddingLeft: spaceLeft, paddingRight: spaceRight }}
        onTextInput={onTextInput}
        {...rest}
      />
      {RightUI}
    </View>
  )
}
