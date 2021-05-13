class ProfilesController < ApplicationController
  before_action :move_back, only: [:edit]
  
  def show
    @user = User.find(params[:id])
    @profile = @user.prepare_profile
    @followings = @user.followings
    @followers = @user.followers
  end

  def edit
    @user = User.find(params[:id])
    @profile = @user.prepare_profile
  end

  def update
    @profile = current_user.prepare_profile
    if @profile.update(profile_params)
      redirect_to profile_path(@profile.user), notice: '更新しました'
    else
      flash.now[:alert] = '更新出来ませんでした'
      render :edit
    end
  end

  private
  def profile_params
    params.require(:profile).permit(:introduction, :avatar).merge(user_id: current_user.id)
  end

  def move_back
    @user = User.find(params[:id])
    if
      !@user.id == current_user.id
      redirect_to root_path
    end
  end
end