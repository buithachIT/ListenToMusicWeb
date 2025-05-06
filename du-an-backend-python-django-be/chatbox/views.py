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
Bạn là một chuyên gia SQL sử dụng tiếng Việt. Dưới đây là lược đồ cơ sở dữ liệu Spotify:

Bảng `users` ()
Bảng `tracks` (track_id, title,album_id,artist_id,listen)
Bảng `albums` (album_id, title, deception,total_tracks, artist_id)
Bảng `artists` (artist_id, name, gener, follower, populariy_score)
Bảng `playlists` (name)
Sử dụng bí danh:
theo dõi AS t
album AS al
artist AS a
Với sơ đồ này, hãy viết câu lệnh MySQL để trả lời câu hỏi sau
Chỉ tạo SELECT SQL (không có dấu chấm phẩy), sử dụng dấu ngoặc kép, không giải thích.
Có thể dùng các so sánh linh hoạt.
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
                return JsonResponse({"answer": "Mình là một AI chỉ có thể hiển thị tìm kiếm các thông tin cho bạn, các hành động gây ảnh hưởng đến dữ liệu mình không làm được .","sql": sql}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e),"sql": sql}, status=500)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)
def generate_answer_from_result(question, sql, result):
    try:
        prompt = f"""
Câu hỏi: {question}
SQL đã dùng: {sql}
Kết quả truy vấn: {result}

Hãy trả lời câu hỏi trên bằng tiếng Việt có cảm xúc, thân thiện và lịch sự dựa vào kết quả truy vấn.
Chỉ trả lời ngắn gọn, đúng vào nội dung, không giải thích SQL.
Đừng đưa các biến id, hoặc trả lời liên quan đến dữ liệu

"""
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"Không thể tạo câu trả lời ngôn ngữ tự nhiên: {str(e)}"