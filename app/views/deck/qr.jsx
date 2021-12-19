import React from 'react'
import { useParams } from 'react-router-dom'

import QRCode from 'qrcode-svg'

const QrCode = () => {
  const { deckId } = useParams()

  const svg = React.useMemo(() => {
    const code = new QRCode({
      content: `https://tenniscards.app/deck/${deckId}/start`,
      container: 'svg-viewbox', // Responsive use
      join: true, // Crisp rendering and 4-5x reduced file size
    })

    return code.svg()
  }, [deckId])

  return <div dangerouslySetInnerHTML={{ __html: svg }} />
}

export {
  QrCode,
}
