class ProfilesController < ApplicationController
  

  def show
    @user = User.find(1)
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
    params.require(:profile).permit(:introduction, :avatar, user_id: current_user.id)
  end
end