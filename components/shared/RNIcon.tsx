import { ArrowLeft, Email, Eye, Lock, Profile } from '@/assets/icons';
import { colors } from '@/theme/colors';
import { forwardRef } from 'react';

type SVGIcon = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

type IconMap = {
  [key: string]: SVGIcon;
};

const icons: IconMap = {
  eye: Eye,
  email: Email,
  profile: Profile,
  arrowLeft: ArrowLeft,
  lock: Lock,
};

interface RNIconProps {
  name: string;
}

const RNIcon = forwardRef((props: RNIconProps, ref) => {
  const IconComponent = icons[props.name];
  return (
    <IconComponent
      color={colors.greyscale500}
      {...props}
    />
  );
}) as SVGIcon;

export default RNIcon;
