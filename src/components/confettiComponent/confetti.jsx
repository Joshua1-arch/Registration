import Confetti from 'react-confetti';

const ConfettiComponent = ({ show }) => {
  return show ? <Confetti /> : null;
};

export default ConfettiComponent;
