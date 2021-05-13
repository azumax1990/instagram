class FollowsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.find(params[:profile_id])
    current_user.follow(user)
    followers_count = user.followers.count
    render json: { status: 'ok',  followersCount: followers_count }
  end

  def show
    user = User.find(params[:profile_id])
    follow_status = current_user.has_followed?(user)
    render json: { hasFollowed: follow_status}
  end
end