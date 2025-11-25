import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    // Obtener la URL base del request (funciona en Vercel y desarrollo)
    const origin = url.origin;
    const logoUrl = `${origin}/logo-lonquimay.png`;
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #7bc143 0%, #6aa839 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Logo container */}
          <div
            style={{
              width: '200px',
              height: '200px',
              marginBottom: '40px',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              width="160"
              height="160"
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
          
          {/* Text container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '900',
                letterSpacing: '-2px',
                marginBottom: '20px',
                textTransform: 'uppercase',
                margin: '0',
              }}
            >
              LONQUIMAY
            </h1>
            <div
              style={{
                fontSize: '36px',
                fontWeight: '400',
                opacity: 0.95,
                letterSpacing: '1px',
                marginBottom: '10px',
              }}
            >
              Municipalidad de Lonquimay
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '300',
                opacity: 0.9,
              }}
            >
              La Pampa - Tu Municipio
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    ) as Response;
  } catch (e: any) {
    console.error('Error generando imagen OG:', e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
};

