import React, { useState, useEffect } from "react";
import api from "../api/axios";

function CommentUser() {
  const [comments, setComments] = useState([]);
  const [contentText, setContentText] = useState("");
  const [rating, setRating] = useState(5); // ค่า default ⭐

  // โหลดคอมเมนต์จาก backend
  const fetchComments = async () => {
    try {
      const res = await api.get("/comments");
      setComments(res.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ส่งคอมเมนต์ใหม่
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contentText) return alert("กรุณากรอกข้อความรีวิว");

    try {
      await api.post("/comments", {
        content_text: contentText,
        popular: rating,
      });

      // รีเซ็ต form
      setContentText("");
      setRating(5);

      // โหลดคอมเมนต์ใหม่
      fetchComments();
    } catch (err) {
      console.error("Submit comment error:", err);
      alert("❌ ไม่สามารถส่งรีวิวได้");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4" style={{ height: "800px" }}>
      <h2 className="text-3xl text-cyan-400 font-bold mb-6">รีวิวจากผู้ใช้</h2>

      {/* Form เพิ่มคอมเมนต์ */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-5 rounded-xl mb-8 border-l-4 border-blue-500"
      >
        <textarea
          className="w-full p-3 rounded bg-gray-800 text-white mb-3"
          placeholder="เขียนรีวิวของคุณ..."
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
        ></textarea>

        {/* ⭐ เลือกคะแนน */}
        <div className="flex items-center mb-3 space-x-2">
          <span className="text-white mr-2">คะแนน:</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className={`text-yellow-400 text-xl ${
                i <= rating ? "scale-110" : "opacity-50"
              } transition`}
              onClick={() => setRating(i)}
            >
              ⭐
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-600 transition"
        >
          ส่งรีวิว
        </button>
      </form>

      {/* แสดงรีวิวทั้งหมด */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-center">ยังไม่มีรีวิว</p>
        )}
        {comments.map((item) => (
          <div
            key={item.comment_id}
            className="bg-gray-900 p-4 rounded-xl border-l-4 border-blue-500"
          >
            <div className="text-yellow-400 mb-1">
              {"⭐".repeat(item.popular || 5)}
            </div>
            <p className="text-gray-100">{item.content_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentUser;
