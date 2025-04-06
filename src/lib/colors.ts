import fs from 'fs'
import sharp from 'sharp'
import getColors from 'get-image-colors'

export async function extractUniqueColors(
    imagePath: string,
    colorCount: number = 30
): Promise<string[]> {
    // Resize image to speed up analysis
    const resizedBuffer = await sharp(imagePath)
        .resize(300, 300, { fit: 'inside' })
        .toBuffer()

    // Get dominant colors
    const colors = await getColors(resizedBuffer, 'image/jpeg') // or image/png

    const hexColors = colors.map((color) => color.hex().toLowerCase())

    // Deduplicate and limit
    const uniqueColors = Array.from(new Set(hexColors)).slice(0, colorCount)

    return uniqueColors
}
