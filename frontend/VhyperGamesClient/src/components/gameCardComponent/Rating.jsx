function Rating(avgRating) {
  let color = "#D24042"
  if (avgRating<=1,5) {
    color = "#D24042";
  } else {
    if (avgRating<2,5) {
      color = "#D2BF40";
    }else{
      color = "#13C345"
    }
    
  }
  return (
    <svg width="27" height="22" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.4849 9.00628C27.0067 7.58457 25.9735 5.61538 25.9735 5.61538C25.9735 5.61538 24.9404 7.58457 24.4621 9.00628C24.1374 9.97177 23.9319 11.0909 23.8128 12.2747C23.5981 12.1813 23.4791 12.1331 23.4791 12.1331C23.2374 9.97616 22.7433 7.92303 21.8764 6.19231C20.7859 4.01532 18.4302 1 18.4302 1C18.4302 1 16.0746 4.01532 14.9841 6.19231C14.0918 7.97367 13.5944 10.0966 13.3608 12.3227C13.3608 12.3227 13.2586 12.3641 13.0728 12.4445C12.9567 11.198 12.7473 10.0178 12.407 9.00628C11.9288 7.58457 10.8957 5.61538 10.8957 5.61538C10.8957 5.61538 9.86254 7.58457 9.38429 9.00628C8.8373 10.6323 8.62866 12.6942 8.6014 14.7667C5.37336 16.7279 1.60237 19.7368 1.0903 23.3018C0.887119 24.7164 1.0903 26.9615 1.0903 26.9615H8.86629L8.59826 31H13.1931L12.925 26.9615H14.4514C14.7502 28.3975 14.9841 29.2692 14.9841 29.2692H15.8178L15.6296 31H21.3709L21.1826 29.2692H21.8764C21.8764 29.2692 22.1103 28.3975 22.4091 26.9615H23.9441L23.6761 31H28.2709L28.0029 26.9615H35.9085C35.9085 26.9615 36.1143 24.6873 35.9085 23.2544C35.388 19.6303 31.5425 16.5735 28.265 14.5874C28.2282 12.5756 28.0161 10.5854 27.4849 9.00628Z" fill={color} />
      <path d="M14.4514 26.9615C14.7502 28.3975 14.9841 29.2692 14.9841 29.2692H15.8178M14.4514 26.9615C13.784 23.7547 12.793 17.7339 13.3608 12.3227M14.4514 26.9615H12.925M22.4091 26.9615C22.1103 28.3975 21.8764 29.2692 21.8764 29.2692H21.1826M22.4091 26.9615C23.0843 23.7172 24.0907 17.5927 23.4791 12.1331M22.4091 26.9615H23.9441M23.4791 12.1331C23.2374 9.97616 22.7433 7.92303 21.8764 6.19231C20.7859 4.01532 18.4302 1 18.4302 1C18.4302 1 16.0746 4.01532 14.9841 6.19231C14.0918 7.97367 13.5944 10.0966 13.3608 12.3227M23.4791 12.1331C23.4791 12.1331 23.5981 12.1813 23.8128 12.2747M13.3608 12.3227C13.3608 12.3227 13.2586 12.3641 13.0728 12.4445M8.6014 14.7667C5.37336 16.7279 1.60237 19.7368 1.0903 23.3018C0.88712 24.7164 1.0903 26.9615 1.0903 26.9615H8.86629M8.6014 14.7667C8.62866 12.6942 8.8373 10.6323 9.38429 9.00628C9.86254 7.58457 10.8957 5.61538 10.8957 5.61538C10.8957 5.61538 11.9288 7.58457 12.407 9.00628C12.7473 10.0178 12.9567 11.198 13.0728 12.4445M8.6014 14.7667C10.6023 13.551 12.3946 12.7379 13.0728 12.4445M23.8128 12.2747C23.9319 11.0909 24.1374 9.97177 24.4621 9.00628C24.9404 7.58457 25.9735 5.61538 25.9735 5.61538C25.9735 5.61538 27.0067 7.58457 27.4849 9.00628C28.0161 10.5854 28.2282 12.5756 28.265 14.5874M23.8128 12.2747C24.5254 12.5846 26.2923 13.3921 28.265 14.5874M28.265 14.5874C31.5425 16.5735 35.388 19.6303 35.9085 23.2544C36.1143 24.6873 35.9085 26.9615 35.9085 26.9615H28.0029M23.9441 26.9615L23.6761 31H28.2709L28.0029 26.9615M23.9441 26.9615H28.0029M12.925 26.9615L13.1931 31H8.59826L8.86629 26.9615M12.925 26.9615H8.86629M15.8178 29.2692L15.6296 31H21.3709L21.1826 29.2692M15.8178 29.2692H21.1826" stroke="#131A26" stroke-width="2" stroke-linejoin="round" />
    </svg>
  )
}

export default Rating;