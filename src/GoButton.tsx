import React from "react";

interface Props {
  onImageFound: (url: string) => void;
}

class GoButton extends React.Component<Props> {
  state = {
    input: "",
  };
  loadImage = () => {
    if (this.state.input)
      fetch(
        // `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.state.input}&api_key=185032d80f1827034396b9acfab5a79f&format=json`
        `http://musicbrainz.org/ws/2/artist/?query=artist:${this.state.input}&fmt=json`
      )
        .then((res) => res.json())
        .then((data) => {
          const mbid = data.artists[0].id;
          // const { mbid } = data.results.artistmatches.artist[0];
          const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels&fmt=json`;
          fetch(url)
            .then((res) => res.json())
            .then((out) => {
              const relations = out.relations;
              const image = relations.filter((r: any) => r.type === "image");
              const discogs = relations.filter(
                (r: any) => r.type === "discogs"
              );
              if (image.length > 1)
                console.warn(
                  "Found many images for artist " + this.state.input,
                  image.length
                );
              if (image.length > 0) {
                let image_url = image[0].url.resource;
                const filename = image_url.substring(
                  image_url.lastIndexOf("/") + 1
                );
                image_url =
                  "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
                  filename;
                this.props.onImageFound(image_url);
              } else if (discogs.length > 0) {
                console.log(discogs[0]);
                const parts = discogs[0].url.resource.split("/");
                const artistDiscogsId = parts[parts.length - 1];
                fetch(
                  `https://api.discogs.com/artists/${artistDiscogsId}?key=CzxYVJJwNUTslrSvkVrc&secret=kthqTovdcEIvHkbChNGxmrBBhgYQeyxl&sort=year`
                )
                  .then((res) => res.json())
                  .then((data) => {
                    const primary = data.images.filter(
                      (image: any) => image.type === "primary"
                    );
                    if (primary.length > 0) {
                      this.props.onImageFound(primary[0].uri);
                    } else {
                      this.props.onImageFound(data.images[0].uri);
                    }
                  });
              }
            });
        });
  };

  render() {
    return (
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 200,
        }}
      >
        <input
          type="text"
          value={this.state.input}
          style={{ width: 100 }}
          onChange={(e) => {
            this.setState({ input: e.currentTarget.value });
          }}
        />
        <button onClick={this.loadImage}>GO</button>
      </div>
    );
  }
}

export default GoButton;
