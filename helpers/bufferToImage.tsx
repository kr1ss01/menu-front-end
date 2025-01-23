const bufferToImage = (image: Buffer, mimeType: string = 'image/jpeg'): string => {
    return `data:${mimeType};base64,${Buffer.from(image).toString('base64')}`;
}

export default bufferToImage;