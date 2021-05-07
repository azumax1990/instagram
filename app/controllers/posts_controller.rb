class PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    @posts = Post.all

  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)
    if @post.save
      redirect_to root_path, notice: '写真を投稿しました'
    else
      flash.now[:alert] = '写真を投稿出来ませんでした'
      render :new
    end
  end

  def destroy
    post = Post.find(params[:id])
    post.destroy
    redirect_to profile_path(current_user), notice: '写真を削除しました'
  end

  private
  def post_params
    params.require(:post).permit(:content, images: [])
  end
end