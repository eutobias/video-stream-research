import os

from flask import Flask, jsonify, request, Response, send_file
from flask_cors import CORS

from lib.generate_chunk_name import generate_chunk_name
from lib.filename_without_extension import filename_without_extension
from lib.merge_chunks import merge_chunks
from config import UPLOAD_DIR

import logging
import re
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/upload',methods=['POST'])
def uploads_api():
    video = request.files.get("file")
    index = request.form.get("index")
    total = request.form.get("total")

    file_without_extension = filename_without_extension(video.filename)
    chunk_name = generate_chunk_name(file_without_extension, index)

    video.save(os.path.join(UPLOAD_DIR, chunk_name))
    
    if (int(index) + 1 == int(total)):
        merge_chunks(video.filename)
    
    return jsonify({"filename": video.filename, "index": index, "total": total})


@app.route('/watch/<video>',methods=['GET'])
def watch_video_api(video):
    if not request.headers.get('Range'):
        return 'Requisição inválida! Cabeçalho Range não encontrado.', 400

    filename = os.path.join(UPLOAD_DIR, video)
    if not os.path.exists(filename):
        return 'Vídeo não encontrado!', 404

    filesize = os.path.getsize(filename)
    
    range_header = request.headers.get('Range')
    m = re.search('bytes=(?P<start>\d+)-(?P<end>\d*)', range_header)
    
    if not m:
        return 'Formato de Range inválido!', 400
    
    start = int(m.group('start'))
    end = int(m.group('end')) if m.group('end') else filesize - 1
    
    chunk_size = min(end - start + 1, 1024 * 1024)  # 1MB máximo por chunk
    end = start + chunk_size - 1
    
    if end >= filesize:
        end = filesize - 1
    
    length = end - start + 1
    
    with open(filename, 'rb') as f:
        f.seek(start)
        data = f.read(length)
    
    content_type = 'video/mp4'
    if filename.endswith('.mkv'):
        content_type = 'video/x-matroska'
    elif filename.endswith('.mov'):
        content_type = 'video/quicktime'
    
    response = Response(
        data,
        206, 
        mimetype=content_type,
        direct_passthrough=True
    )
    
    response.headers.add('Content-Range', f'bytes {start}-{end}/{filesize}')
    response.headers.add('Accept-Ranges', 'bytes')
    response.headers.add('Content-Length', str(length))
        
    return response


@app.route('/videos',methods=['GET'])
def list_videos_api():
    videos = []

    for video in os.listdir('./uploads'):
        if (video.endswith(".mp4") or video.endswith(".mkv") or video.endswith(".mov")):
            videos.append(video)    

    return jsonify(videos)

if __name__ == '__main__':
    app.run(port=3001, host='0.0.0.0')