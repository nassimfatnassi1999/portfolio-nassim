import { useProfile } from '../context/ProfileContext';
import { CloudTerminal } from './terminals/CloudTerminal';
import { SoftwareTerminal } from './terminals/SoftwareTerminal';
import { SysAdminTerminal } from './terminals/SysAdminTerminal';

interface DynamicTerminalProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function DynamicTerminal({ variant = 'desktop', className = '' }: DynamicTerminalProps) {
  const { currentProfileId } = useProfile();

  switch (currentProfileId) {
    case 'software':
      return <SoftwareTerminal variant={variant} className={className} />;
    case 'system-admin':
      return <SysAdminTerminal variant={variant} className={className} />;
    case 'cloud-devops':
    default:
      return <CloudTerminal variant={variant} className={className} />;
  }
}
