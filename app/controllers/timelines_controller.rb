class TimelinesController < ApplicationController

  def index
    followings = current_user.followings
    @posts = []
    followings.each do |following|
      following.posts.each do |post|
        @posts.push(post)
      end
    end
    @posts = @posts.sort.reverse
  end
end