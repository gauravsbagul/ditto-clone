import styled from 'styled-components/native'

const SenderText = styled.Text`
  color: ${({ color }) => (color || 'pink')};
  font-size: 14;
  font-weight: 400;
  margin-left: 22;
  margin-right: 22;
  margin-top: 8;
  opacity: 0.8;
  ${({ isMe }) => (isMe ? 'text-align: right;' : '')};
`
export default SenderText
