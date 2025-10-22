import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import "./EditPost.css";
import { UpdatePost } from "../../services/apiService";
import { toast } from "react-toastify";

const EditPost = ({ isOpen, onClose, post, onUpdatePost }) => {
	const [editData, setEditData] = useState({
		content: "",
		images: [],
	});
	const [newImages, setNewImages] = useState([]);

	useEffect(() => {
		if (post) {
			setEditData({
				content: post.content || "",
				images: post.images || [],
			});
			setNewImages([]);
		}
	}, [post]);

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target.result;
				setNewImages((prev) => [...prev, { imageUrl, file }]);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleRemoveExistingImage = (index) => {
		setEditData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleRemoveNewImage = (index) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		if (
			!editData.content.trim() &&
			newImages.length === 0 &&
			editData.images.length === 0
		) {
			toast.error("Post cannot be empty!");
			return;
		}
		let updatedPost = {
			...post,
			content: editData.content,
			images: [...editData.images, ...newImages],
		};
		const formData = new FormData();
		formData.append("id", post.id);
		formData.append("content", updatedPost?.content);
		if (updatedPost?.images && updatedPost.images.length > 0) {
			updatedPost.images.forEach((img) => {
				if (img.file) {
					formData.append("image", img.file);
				} else {
					formData.append("existingImages", img);
				}
			});
		}
		let response = await UpdatePost(formData);
		updatedPost = {
			...post,
			content: response.post.content,
			images: JSON.parse(response.post.imageUrl) || [],
		};

		if (response && response.errCode === 0) {
			toast.success("Post updated successfully!");
			onUpdatePost(updatedPost);
			onClose();
		}
	};

	const handleCancel = () => {
		setEditData({
			content: post?.content || "",
			images: post?.images || [],
		});
		setNewImages([]);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="edit-post-overlay" onClick={handleCancel}>
			<div className="edit-post-modal" onClick={(e) => e.stopPropagation()}>
				<div className="edit-post-header">
					<h2>Edit Post</h2>
					<button className="close-btn" onClick={handleCancel}>
						<X size={24} />
					</button>
				</div>

				<div className="edit-post-body">
					<div className="form-group">
						<label className="form-label">Caption</label>
						<textarea
							className="form-textarea"
							value={editData.content}
							onChange={(e) =>
								setEditData((prev) => ({ ...prev, content: e.target.value }))
							}
							placeholder="What's on your mind?"
							rows={4}
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Images</label>

						{/* Existing Images */}
						{editData.images.length > 0 && (
							<div className="images-section">
								<h4 className="images-subtitle">Current Images</h4>
								<div className="images-grid">
									{editData.images.map((image, index) => (
										<div key={index} className="image-item">
											<img src={image} alt={`Post ${index}`} />
											<button
												className="remove-image-btn"
												onClick={() => handleRemoveExistingImage(index)}
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* New Images */}
						{newImages.length > 0 && (
							<div className="images-section">
								<h4 className="images-subtitle">New Images</h4>
								<div className="images-grid">
									{newImages.map((image, index) => (
										<div key={index} className="image-item">
											<img src={image.imageUrl} alt={`New ${index}`} />
											<button
												className="remove-image-btn"
												onClick={() => handleRemoveNewImage(index)}
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Upload New Images */}
						<div className="upload-section">
							<input
								type="file"
								id="image-upload"
								multiple
								accept="image/*"
								onChange={handleImageUpload}
								className="file-input"
							/>
							<label htmlFor="image-upload" className="upload-btn">
								<Upload size={20} />
								Add Images
							</label>
						</div>
					</div>
				</div>

				<div className="edit-post-footer">
					<button className="cancel-btn" onClick={handleCancel}>
						Cancel
					</button>
					<button className="save-btn" onClick={handleSave}>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditPost;
