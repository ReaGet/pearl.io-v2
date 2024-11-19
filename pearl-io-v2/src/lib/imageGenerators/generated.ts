// import { createCanvas, loadImage, registerFont } from 'canvas'
// import { parseMetadata } from '../metadata'
// import { ImageGeneratorOptions } from '@/types/image'

// export async function generateImage({ url, width = 1200, height = 630 }: ImageGeneratorOptions) {
//   const metadata = await parseMetadata(url)
//   const canvas = createCanvas(width, height)
//   const ctx = canvas.getContext('2d')

//   // Настройка фона
//   ctx.fillStyle = '#ffffff'
//   ctx.fillRect(0, 0, width, height)

//   // Добавление градиента
//   const gradient = ctx.createLinearGradient(0, 0, width, height)
//   gradient.addColorStop(0, '#4f46e5')
//   gradient.addColorStop(1, '#818cf8')
//   ctx.fillStyle = gradient
//   ctx.fillRect(0, 0, width, height)

//   // Добавление текста
//   ctx.fillStyle = '#ffffff'
//   ctx.font = 'bold 60px Inter'
//   ctx.textAlign = 'center'
//   ctx.textBaseline = 'middle'

//   // Разбиваем текст на строки
//   const words = metadata.title.split(' ')
//   let lines = []
//   let currentLine = words[0]

//   for (let i = 1; i < words.length; i++) {
//     const word = words[i]
//     const width = ctx.measureText(`${currentLine} ${word}`).width
//     if (width < 1000) {
//       currentLine += ` ${word}`
//     } else {
//       lines.push(currentLine)
//       currentLine = word
//     }
//   }
//   lines.push(currentLine)

//   // Отрисовка текста
//   lines.forEach((line, i) => {
//     const y = height / 2 - ((lines.length - 1) * 70) / 2 + i * 70
//     ctx.fillText(line, width / 2, y)
//   })

//   // Добавление URL
//   ctx.font = '30px Inter'
//   ctx.fillText(new URL(url).hostname, width / 2, height - 50)

//   return canvas.toBuffer('image/jpeg', { quality: 0.9 })
// } 