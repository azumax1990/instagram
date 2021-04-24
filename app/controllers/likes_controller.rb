class LikesController < ApplicationController
  before_action :authenticate_user!
  
  def create
    Like.create(post_id: params[:post_id], user_id: current_user.id)
    redirect_to posts_path
  end

  def destroy
    post = Post.find(params[:post_id])
    like = post.likes.find_by(user_id: current_user.id)
    like.destroy
    redirect_to posts_path
  end 
end