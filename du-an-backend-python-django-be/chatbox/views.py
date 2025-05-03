from google.genai import Client
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import connection
# Đặt API key từ Google GenAI
api_key = "AIzaSyDIWoW6Wn049vv6i_Qr0G5eTEqc1Hd7aLg"  # Thay thế với API key từ Google

# Tạo một client cho Google GenAI
client = Client(api_key=api_key)
PROMPT_HEADER = """
Schema:
tracks(track_id, title, album_id → albums.album_id, artist_id → artists.artist_id,listen)
albums(album_id, title)
artists(artist_id, name,follower,genner,popularity_score)

Use aliases:
  tracks AS t
  albums AS al
  artists AS a
FOR MYSQL
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
def generate_sql(question):
    try:
        prompt = PROMPT_HEADER.format(question=question)
        # Gửi yêu cầu tới Google GenAI để sinh câu lệnh SQL từ câu hỏi
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Chọn mô hình bạn muốn sử dụng (ví dụ: gemini-2.0-flash)
            contents=prompt
        )
        # Trả về câu lệnh SQL sinh được
        sql = response.text.strip()
        sql = sql.replace('```sql', '').replace('```', '').strip()
        return sql
    except Exception as e:
        return str(e)
def execute_sql(sql):
    try:
        # Mở kết nối đến cơ sở dữ liệu
        with connection.cursor() as cursor:
            cursor.execute(sql)  # Thực thi câu lệnh SQL
            # Lấy kết quả trả về dưới dạng list of tuples
            result = cursor.fetchall()
            # Lấy tên cột
            columns = [col[0] for col in cursor.description]
            # Trả về kết quả dưới dạng danh sách các từ điển (key: tên cột, value: giá trị)
            result_dict = [dict(zip(columns, row)) for row in result]
        return result_dict
    except Exception as e:
        return str(e)
@csrf_exempt
def chat_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        question = data.get("question", "")
        try:
            # Sinh câu lệnh SQL từ câu hỏi
            sql = generate_sql(question)
            if sql.startswith("SELECT"):
                # Thực thi câu lệnh SQL nếu là SELECT
                result = execute_sql(sql)
                answer = generate_answer_from_result(question, sql, result)
                return JsonResponse({
                    "sql": sql,
                    "result": result,
                    "answer": answer
                })
            else:
                return JsonResponse({"error": "Câu lệnh SQL không hợp lệ.","sql": sql}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e),"sql": sql}, status=500)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)

def generate_answer_from_result(question, sql, result):
    try:
        prompt = f"""
Câu hỏi: {question}
SQL đã dùng: {sql}
Kết quả truy vấn: {result}

Hãy trả lời câu hỏi trên bằng tiếng Việt có cảm xúc và lịch sự dựa vào kết quả truy vấn.
Chỉ trả lời ngắn gọn, đúng vào nội dung, không giải thích SQL.
"""
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"Không thể tạo câu trả lời ngôn ngữ tự nhiên: {str(e)}"
