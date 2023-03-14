const embedLink = "https://www.youtube.com/embed/"

const getEmbedLink = (id, time) => {
  return embedLink + id + "?start=" + time
}

export default getEmbedLink