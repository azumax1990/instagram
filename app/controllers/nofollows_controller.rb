class NofollowsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.find(params[:profile_id])
    current_user.unfollow(user)
    followers_count = user.followers.count
    render json: { status: 'ok',  followersCount: followers_count }
  end
end