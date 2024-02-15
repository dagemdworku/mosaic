# Mosaic

Mosaic is a video upload and player app built with React Native. It uses the MinIO S3 storage system to store and retrieve videos.

## Setup

Follow these steps to set up the Mosaic project:

1. Clone the repository:

```sh
git clone https://github.com/dagemdworku/mosaic.git
cd mosaic
```

2. Install the dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory of the project. This file will contain the default credentials for the MinIO S3 storage system. The file should have the following structure:

```
DEFAULT_ENDPOINT=your-endpoint
DEFAULT_USERNAME=your-username
DEFAULT_PASSWORD=your-password
```

Replace `your-endpoint`, `your-username`, and `your-password` with your actual MinIO credentials.

4. Start the project:
```sh
npm start
```

## Usage
After setting up the project, you can upload videos to the MinIO S3 storage system and play them in the app.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request if you would like to help improve Mosaic.

## License
Mosaic is licensed under the MIT License. See the LICENSE file for more information.