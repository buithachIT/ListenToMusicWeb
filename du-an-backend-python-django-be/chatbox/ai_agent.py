import re
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, Text2TextGenerationPipeline

# 1) Cấu hình MySQL
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_HOST = 'localhost'
MYSQL_PORT = '3306'
MYSQL_DB = 'spotify_db'
connection_str = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
engine = create_engine(connection_str, pool_recycle=3600)

# 2) Load model nhẹ hơn (ví dụ: sqlcoder-1b)
model_name = "defog/sqlcoder-1b"  # hoặc "defog/sqlcoder-1b-truss"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)
generator = Text2TextGenerationPipeline(model=model, tokenizer=tokenizer, device=-1)  # -1: dùng CPU

# 3) Prompt template
PROMPT_HEADER = """
Schema:
tracks(track_id, title, album_id → albums.album_id, artist_id → artists.artist_id)
albums(album_id, title)
artists(artist_id, name)

Use aliases:
  tracks AS t
  albums AS al
  artists AS a

Generate only SELECT SQL (no semicolon), use single quotes, no explanation.

# Logic:
If question mentions “album”, join albums AS al ON t.album_id=al.album_id and filter al.title.
If question mentions “ca sĩ” or “của <artist>”, join artists AS a ON t.artist_id=a.artist_id and filter a.name.

# Examples:
Q: "Các bài hát trong album 'Vol 1' là gì?"
SQL: SELECT t.title
     FROM tracks AS t
     JOIN albums AS al ON t.album_id = al.album_id
     WHERE al.title = 'Vol 1'

Q: "Các bài hát trong album 'Vol 2'?"
SQL: SELECT t.title
     FROM tracks AS t
     JOIN albums AS al ON t.album_id = al.album_id
     WHERE al.title = 'Vol 2'

Q: "Những bài hát của ca sĩ Sơn Tùng M-TP là gì?"
SQL: SELECT t.title
     FROM tracks AS t
     JOIN artists AS a ON t.artist_id = a.artist_id
     WHERE a.name = 'Sơn Tùng M-TP'

# Now your question:
Q: "{question}"
SQL:
"""

# 4) Chuyển câu hỏi thành SQL
def question_to_sql(question: str) -> str:
    prompt = PROMPT_HEADER.format(question=question)
    # Truncate nếu quá dài
    inputs = tokenizer(prompt, return_tensors='pt', truncation=True, max_length=512)
    out = generator(
        tokenizer.decode(inputs['input_ids'][0]),
        max_length=128,
        do_sample=False
    )[0]["generated_text"]
    sql = out.strip()

    # ----- Sửa lỗi phổ biến -----
    sql = re.sub(r"\bt\.name\b", "t.title", sql, flags=re.IGNORECASE)
    sql = re.sub(
        r"ON\s+t\.artist_id\s*=\s*t\.album_id",
        "ON t.album_id = al.album_id",
        sql,
        flags=re.IGNORECASE
    )

    # Đảm bảo câu bắt đầu bằng SELECT
    if not re.match(r"(?i)^SELECT", sql):
        raise ValueError(f"Model không tạo SQL đúng: {sql}")
    return sql

# 5) Thực thi SQL
def run_sql(sql: str):
    with engine.connect() as conn:
        result = conn.execute(text(sql))
        return result.mappings().all()

# 6) Format kết quả
def format_rows(rows):
    if not rows:
        return "Không tìm thấy kết quả."
    lines = [", ".join(f"{k}={v}" for k, v in row.items()) for row in rows[:10]]
    if len(rows) > 10:
        lines.append(f"... và {len(rows)-10} hàng khác")
    return "\n".join(lines)

# 7) Hàm chính xử lý đầu vào
def get_ai_response(question: str) -> str:
    try:
        sql = question_to_sql(question)
        print("Generated SQL:", sql)

        try:
            rows = run_sql(sql)
            print("Rows from DB:", rows)
            return format_rows(rows)
        except ProgrammingError as pe:
            return f"Lỗi SQL ({pe.orig.args[0]}):\n{sql}"
    except Exception as e:
        return f"Lỗi sinh hoặc chạy SQL: {e}"
