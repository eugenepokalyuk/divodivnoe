import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Заглушка фавикона: буква «Д» на фирменной розовой плашке.
// Заменить на логотип мастерской, когда он появится.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#8F5B6B',
          borderRadius: 7,
          color: '#FBF9F7',
          fontSize: 20,
          fontFamily: 'serif',
        }}
      >
        Д
      </div>
    ),
    { ...size },
  );
}
