import { redirect } from 'next/navigation'

// El panel de administración se retiró: todo se maneja desde OptiOS.
export default function AdminRetirado() {
  redirect('/')
}
