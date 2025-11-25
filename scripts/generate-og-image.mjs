import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateOgImage() {
  console.log('Generando imagen Open Graph...');
  
  const logoPath = path.join(__dirname, '../public/logo-lonquimay.png');
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  
  const response = new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7bc143 0%, #5a9a32 100%)',
          fontFamily: 'system-ui, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '180px',
                height: '180px',
                marginBottom: '30px',
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              },
              children: {
                type: 'img',
                props: {
                  src: logoBase64,
                  alt: 'Logo',
                  width: 150,
                  height: 150,
                  style: { objectFit: 'contain' },
                },
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '64px',
                      fontWeight: '800',
                      letterSpacing: '-1px',
                      margin: '0 0 15px 0',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    },
                    children: 'LONQUIMAY',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: '500',
                      opacity: 0.95,
                      marginBottom: '8px',
                    },
                    children: 'Tu Municipio',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: '400',
                      opacity: 0.85,
                    },
                    children: 'La Pampa, Argentina',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const outputPath = path.join(__dirname, '../public/og-image.png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✓ Imagen OG generada: ${outputPath}`);
  console.log(`  Tamaño: ${(buffer.length / 1024).toFixed(1)} KB`);
}

generateOgImage().catch(console.error);

