const embedLink = "https://www.youtube.com/embed/"

const getEmbedLink = (id, time) => {
  return embedLink + id + "?start=" + time
}

const pageNumRegex = /^[0-9]*$/

export {getEmbedLink, pageNumRegex}