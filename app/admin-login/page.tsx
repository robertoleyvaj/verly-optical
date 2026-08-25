import { redirect } from 'next/navigation'

// Login del panel retirado: la administración se hace desde OptiOS.
export default function AdminLoginRetirado() {
  redirect('/')
}
