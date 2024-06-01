import { ArrowLeft, Delete, Email, Eye, Lock, Profile } from '@/assets/icons';
import { colors } from '@/theme/colors';
import { forwardRef } from 'react';

type SVGIcon = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

enum Icons {
  eye = 'eye',
  email = 'email',
  profile = 'profile',
  arrowLeft = 'arrowLeft',
  lock = 'lock',
  delete = 'delete',
}

type IconMap = {
  [key in Icons]: SVGIcon;
};

const icons: IconMap = {
  eye: Eye,
  email: Email,
  profile: Profile,
  arrowLeft: ArrowLeft,
  lock: Lock,
  delete: Delete,
};

interface RNIconProps {
  name: Icons;
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
