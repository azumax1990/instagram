class NofollowsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.find(params[:profile_id])
    relationship = current_user.unfollow(user)
    relationship.destroy
    followers_count = user.followers.count
    render json: { status: 'ok',  followersCount: followers_count }
  end
end