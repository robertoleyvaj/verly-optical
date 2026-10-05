// Logo de texto (sin isotipo): VERLY con OPTICAL abajo.
export default function Logo({ color = 'var(--charcoal)', size = 22 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, color, fontFamily: 'var(--font-sans)' }} aria-label="Verly Optical">
      <span style={{ fontSize: size, fontWeight: 500, letterSpacing: '0.34em', marginRight: '-0.34em' }}>VERLY</span>
      <span style={{ fontSize: Math.max(7, Math.round(size * 0.34)), fontWeight: 500, letterSpacing: '0.42em', marginRight: '-0.42em', marginTop: Math.round(size * 0.22), opacity: 0.8 }}>OPTICAL</span>
    </span>
  );
}
