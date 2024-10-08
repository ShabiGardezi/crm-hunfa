import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

const BubbleContainer = styled(Box)(({ theme, owner }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: owner ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2)
}))

const Bubble = styled(Box)(({ theme, owner }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '12%',
  padding: theme.spacing(2, 5),
  borderRadius: '10px',
  backgroundColor: owner ? theme.palette.primary.main : theme.palette.grey[800],
  color: owner ? theme.palette.primary.contrastText : theme.palette.text.primary,
  position: 'relative',
  maxWidth: '75%'
}))

const SenderName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(0.5),
  color: 'blue',
  userSelect: 'none' // Disable text selection
}))

const MessageBubble = ({ message, files = [], owner, senderName, timestamp }) => {

  const handleDownload = (url, filename) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary URL for the Blob object
        const blobUrl = window.URL.createObjectURL(blob)

        // Create a temporary anchor element
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename || 'download'

        // Append the anchor to the body (required for Firefox)
        document.body.appendChild(link)
        link.click()

        // Clean up
        window.URL.revokeObjectURL(blobUrl)
        document.body.removeChild(link)
      })
      .catch(error => console.error('Download failed:', error))
  }

  // to preview text, images and videos
  const renderFilePreview = file => {
    const filePreviewBoxStyles = {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 1.5,
      bgcolor: 'rgba(255, 255, 255, 0.1)',
      padding: 1,
      borderRadius: 2
    }

    //for images
    // if (file.url.includes('image')) {
    //   return (
    //     <Box key={file._id} {...filePreviewBoxStyles}>
    //       <img
    //         src={`${file.url}?w=150&h=150&c=thumb`}
    //         alt='Preview'
    //         onClick={() => handleThumbnailClick(file.url)}
    //         style={{ cursor: 'pointer', height: '25vh', width: '20vw', borderRadius: '15px', marginRight: '1rem' }}
    //       />
    //       <IconButton onClick={() => handleDownload(file.url, file.filename)}>
    //         <FileDownloadOutlinedIcon sx={{ color: 'white' }} />
    //       </IconButton>
    //     </Box>
    //   )
    // }

    //for videos
    // if (file.url.includes('mp4')) {
    //   return (
    //     <Box key={file._id} {...filePreviewBoxStyles}>
    //       <video
    //         src={file.url}
    //         controls
    //         onClick={() => handleThumbnailClick(file.url)}
    //         style={{ cursor: 'pointer', height: '25vh', width: '20vw', borderRadius: '15px', marginRight: '1rem' }}
    //       >
    //         Your browser does not support the video tag.
    //       </video>
    //       <IconButton onClick={() => handleDownload(file.url, file.filename)}>
    //         <FileDownloadOutlinedIcon sx={{ color: 'white' }} />
    //       </IconButton>
    //     </Box>
    //   )
    // }

    if (file.url.includes('file')) {
      return (
        <Box key={file._id} {...filePreviewBoxStyles}>
          <TextSnippetOutlinedIcon sx={{ color: 'white', marginRight: 1 }} />
          <Typography variant='body1' color='white' flexGrow={1} sx={{ userSelect: 'none' }}>
            {file.filename}
          </Typography>
          <IconButton onClick={() => handleDownload(file.url, file.filename)}>
            <FileDownloadOutlinedIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      )
    }

    return null
  }

  return (
    <BubbleContainer owner={owner}>
      <Bubble owner={owner} display='flex' flexDirection='column'>
        <SenderName variant='body2'>{owner ? 'You' : senderName}</SenderName>
        {message && (
          <Typography variant='body2' gutterBottom color='white' marginX={3} borderRadius={2}>
            {message}
          </Typography>
        )}

        {files.map(file => renderFilePreview(file))}

        <Typography
          variant='caption'
          sx={{
            marginTop: 1,
            color: 'white',
            textAlign: 'end',
            display: 'block',
            userSelect: 'none'
          }}
        >
          {dayjs(timestamp).format('h:mm A')}
        </Typography>
      </Bubble>
    </BubbleContainer>
  )
}

export default MessageBubble
