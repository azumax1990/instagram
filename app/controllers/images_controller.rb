class ImagesController < ApplicationController
  before_action :authenticate_user!

  def update
    profile = current_user.prepare_profile
    profile.update(image_params)
    render json: profile 

  end

  private
  def image_params
    params.require(:profile).permit(:avatar)
  end
end